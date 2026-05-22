import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  CalendarOff, Plus, Trash2, Clock, MapPin,
  AlertCircle, Check, ChevronLeft, ChevronRight, Calendar
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const HOUR_OPTIONS = [
  { label: '10:00 AM', value: '10' },
  { label: '11:00 AM', value: '11' },
  { label: '12:00 PM', value: '12' },
  { label: '01:00 PM', value: '13' },
  { label: '02:00 PM', value: '14' },
  { label: '03:00 PM', value: '15' },
  { label: '04:00 PM', value: '16' },
  { label: '05:00 PM', value: '17' },
  { label: '06:00 PM', value: '18' },
  { label: '07:00 PM', value: '19' },
];

const END_HOUR_OPTIONS = [
  { label: '11:00 AM', value: '11' },
  { label: '12:00 PM', value: '12' },
  { label: '01:00 PM', value: '13' },
  { label: '02:00 PM', value: '14' },
  { label: '03:00 PM', value: '15' },
  { label: '04:00 PM', value: '16' },
  { label: '05:00 PM', value: '17' },
  { label: '06:00 PM', value: '18' },
  { label: '07:00 PM', value: '19' },
  { label: '08:00 PM', value: '20' },
];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ─────────────────────────── helpers ─────────────────────────── */

/** Normalise a block's date to a YYYY-MM-DD string in LOCAL time */
function blockToLocalDate(block) {
  // block.date may be ISO string like "2026-05-20T00:00:00.000Z"
  // We only want the date portion regardless of timezone
  const raw = block.date;
  if (!raw) return '';
  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // Parse and extract local YYYY-MM-DD
  const d = new Date(raw);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toYMD(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function todayYMD() {
  const n = new Date();
  return toYMD(n.getFullYear(), n.getMonth(), n.getDate());
}

/* ─────────────────────── Premium Calendar ─────────────────────── */

const PremiumCalendar = ({ blocks, selectedDate, onSelectDate }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Build a Set of blocked date strings for O(1) lookup
  const blockedDates = new Set(blocks.map(blockToLocalDate));

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  // Previous month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false, key: `prev-${i}` });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const ymd = toYMD(viewYear, viewMonth, d);
    cells.push({ day: d, current: true, ymd, key: `cur-${d}` });
  }
  // Next month filler to complete last row
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false, key: `next-${d}` });
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const todayStr = todayYMD();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fffdf7 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(212,175,55,0.18)',
      boxShadow: '0 4px 32px rgba(212,175,55,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* Calendar Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 16px',
        borderBottom: '1px solid rgba(212,175,55,0.12)',
        background: 'linear-gradient(90deg, rgba(212,175,55,0.06) 0%, transparent 100%)',
      }}>
        <button
          onClick={prevMonth}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            border: '1px solid rgba(212,175,55,0.25)',
            background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#D4AF37',
            transition: 'all 0.2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#D4AF37'; }}
          title="Previous month"
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.12em',
            color: '#111',
            textTransform: 'uppercase',
          }}>
            {MONTH_NAMES[viewMonth]}
          </div>
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.7rem',
            color: '#D4AF37',
            fontWeight: 600,
            letterSpacing: '0.2em',
          }}>
            {viewYear}
          </div>
        </div>

        <button
          onClick={nextMonth}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            border: '1px solid rgba(212,175,55,0.25)',
            background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#D4AF37',
            transition: 'all 0.2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#D4AF37'; }}
          title="Next month"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day Labels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        padding: '12px 16px 4px',
        gap: '2px',
      }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{
            textAlign: 'center',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#B8960C',
            textTransform: 'uppercase',
            padding: '4px 0',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        padding: '4px 16px 20px',
        gap: '3px',
      }}>
        {cells.map(cell => {
          if (!cell.current) {
            return (
              <div key={cell.key} style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d1d5db',
                fontSize: '0.78rem',
                fontFamily: 'Inter, sans-serif',
              }}>
                {cell.day}
              </div>
            );
          }

          const isToday = cell.ymd === todayStr;
          const isSelected = cell.ymd === selectedDate;
          const isBlocked = blockedDates.has(cell.ymd);

          let cellBg = 'transparent';
          let cellColor = '#374151';
          let cellBorder = 'transparent';
          let cellShadow = 'none';

          if (isSelected) {
            cellBg = 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)';
            cellColor = 'white';
            cellShadow = '0 4px 12px rgba(212,175,55,0.4)';
          } else if (isToday) {
            cellBorder = '#D4AF37';
            cellColor = '#B8960C';
          }

          return (
            <div
              key={cell.key}
              onClick={() => onSelectDate(isSelected ? null : cell.ymd)}
              title={isBlocked ? 'Has blocked slots' : ''}
              style={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '10px',
                cursor: 'pointer',
                position: 'relative',
                background: isSelected ? 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)' : (isBlocked && !isSelected ? 'rgba(212,175,55,0.07)' : 'transparent'),
                color: cellColor,
                border: `1.5px solid ${isSelected ? 'transparent' : (isToday ? '#D4AF37' : 'transparent')}`,
                boxShadow: cellShadow,
                transition: 'all 0.18s ease',
                fontSize: '0.82rem',
                fontWeight: isToday || isSelected ? 700 : 400,
                fontFamily: 'Inter, sans-serif',
                userSelect: 'none',
                minHeight: 36,
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.13)';
                  e.currentTarget.style.color = '#B8960C';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.background = isBlocked ? 'rgba(212,175,55,0.07)' : 'transparent';
                  e.currentTarget.style.color = isToday ? '#B8960C' : '#374151';
                }
              }}
            >
              <span>{cell.day}</span>
              {/* Blocked indicator dot */}
              {isBlocked && (
                <span style={{
                  position: 'absolute',
                  bottom: 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: isSelected ? 'rgba(255,255,255,0.8)' : '#D4AF37',
                  boxShadow: isSelected ? 'none' : '0 0 4px rgba(212,175,55,0.5)',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '12px 24px 16px',
        borderTop: '1px solid rgba(212,175,55,0.1)',
        background: 'rgba(212,175,55,0.02)',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#D4AF37',
            boxShadow: '0 0 4px rgba(212,175,55,0.5)',
            display: 'inline-block',
          }} />
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.58rem', color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Has blocked slots
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 22, height: 22, borderRadius: '8px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8960C 100%)',
            display: 'inline-block',
          }} />
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.58rem', color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Selected date
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 22, height: 22, borderRadius: '8px',
            border: '1.5px solid #D4AF37',
            display: 'inline-block',
          }} />
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: '0.58rem', color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Today
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── Date Detail Panel ─────────────────────── */

const DateDetailPanel = ({ selectedDate, blocks, onUnblock }) => {
  const getHourLabel = (val, list = HOUR_OPTIONS) => {
    const found = list.find(o => o.value === val);
    return found ? found.label : `${val}:00`;
  };

  if (!selectedDate) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fffdf7 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(212,175,55,0.18)',
        boxShadow: '0 4px 32px rgba(212,175,55,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 12,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Calendar size={22} style={{ color: '#D4AF37' }} />
        </div>
        <p style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#aaa',
          letterSpacing: '0.08em',
          textAlign: 'center',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Select a date on the calendar<br />to view blocked slots
        </p>
      </div>
    );
  }

  // Format the selected date nicely
  const [y, m, d] = selectedDate.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Filter blocks for this date
  const dayBlocks = blocks.filter(b => blockToLocalDate(b) === selectedDate);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fffdf7 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(212,175,55,0.18)',
      boxShadow: '0 4px 32px rgba(212,175,55,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* Panel Header */}
      <div style={{
        padding: '18px 24px 14px',
        borderBottom: '1px solid rgba(212,175,55,0.12)',
        background: 'linear-gradient(90deg, rgba(212,175,55,0.06) 0%, transparent 100%)',
      }}>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.62rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#D4AF37',
          marginBottom: 4,
        }}>
          Blocked Slots For
        </div>
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.92rem',
          fontWeight: 700,
          color: '#111',
          letterSpacing: '0.04em',
        }}>
          {formattedDate}
        </div>
        <div style={{
          marginTop: 6,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          background: dayBlocks.length > 0 ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
          border: `1px solid ${dayBlocks.length > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}`,
          borderRadius: 20,
          padding: '3px 10px',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: dayBlocks.length > 0 ? '#ef4444' : '#10b981',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.58rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: dayBlocks.length > 0 ? '#b91c1c' : '#065f46',
          }}>
            {dayBlocks.length > 0 ? `${dayBlocks.length} block${dayBlocks.length > 1 ? 's' : ''} active` : 'No blocks'}
          </span>
        </div>
      </div>

      {/* Block Cards */}
      <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {dayBlocks.length === 0 ? (
          <div style={{
            padding: '28px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Check size={20} style={{ color: '#10b981' }} />
            </div>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.05rem',
              fontStyle: 'italic',
              color: '#6b7280',
              margin: 0,
            }}>
              No blocked slots for this date.
            </p>
            <p style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.58rem',
              color: '#aaa',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              All booking slots are open.
            </p>
          </div>
        ) : (
          dayBlocks.map((block, idx) => (
            <div
              key={block._id}
              style={{
                background: 'white',
                borderRadius: 14,
                border: '1px solid rgba(212,175,55,0.15)',
                boxShadow: '0 2px 12px rgba(212,175,55,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 12,
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(212,175,55,0.14), 0 2px 6px rgba(0,0,0,0.06)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(212,175,55,0.06), 0 1px 3px rgba(0,0,0,0.04)'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1, minWidth: 0 }}>
                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CalendarOff size={16} style={{ color: '#D4AF37' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Type badge + branch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{
                      padding: '2px 9px',
                      borderRadius: 20,
                      fontFamily: 'Cinzel, serif',
                      fontSize: '0.58rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      background: block.type === 'Full Day' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.1)',
                      color: block.type === 'Full Day' ? '#b91c1c' : '#92400e',
                      border: `1px solid ${block.type === 'Full Day' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.2)'}`,
                    }}>
                      {block.type}
                    </span>

                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontFamily: 'Cinzel, serif', fontSize: '0.6rem',
                      color: '#6b7280', fontWeight: 600, letterSpacing: '0.06em',
                    }}>
                      <MapPin size={10} style={{ color: '#D4AF37', flexShrink: 0 }} />
                      {block.branch === 'All' ? 'All Branches' : `${block.branch} Branch`}
                    </span>
                  </div>

                  {/* Time range */}
                  {block.type === 'Time Range' && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      marginBottom: 5,
                    }}>
                      <Clock size={11} style={{ color: '#9ca3af', flexShrink: 0 }} />
                      <span style={{
                        fontFamily: 'Inter, sans-serif', fontSize: '0.78rem',
                        fontWeight: 600, color: '#374151', letterSpacing: '0.02em',
                      }}>
                        {(() => {
                          const start = HOUR_OPTIONS.find(o => o.value === block.startTime);
                          const end = END_HOUR_OPTIONS.find(o => o.value === block.endTime);
                          return `${start ? start.label : block.startTime + ':00'} → ${end ? end.label : block.endTime + ':00'}`;
                        })()}
                      </span>
                    </div>
                  )}

                  {/* Reason */}
                  {block.reason && (
                    <p style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '0.88rem',
                      fontStyle: 'italic',
                      color: '#6b7280',
                      margin: 0,
                      lineHeight: 1.4,
                    }}>
                      &ldquo;{block.reason}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Unblock button */}
              <button
                onClick={() => onUnblock(block._id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px',
                  background: 'rgba(239,68,68,0.06)',
                  color: '#dc2626',
                  border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.18s',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; }}
                title="Unblock this slot"
              >
                <Trash2 size={12} />
                Unblock
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ─────────────────────── Main Component ─────────────────────── */

const SlotManagement = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: '',
    type: 'Full Day',
    startTime: '10',
    endTime: '13',
    branch: 'All',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Calendar state ──
  const [selectedCalDate, setSelectedCalDate] = useState(null);

  const fetchBlocks = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/slot-blocks`);
      setBlocks(res.data);
    } catch (err) {
      console.error('Failed to fetch slot blocks', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlocks();
  }, [fetchBlocks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.date) {
      setError('Date is required');
      return;
    }

    try {
      const postData = {
        date: form.date,
        type: form.type,
        branch: form.branch,
        reason: form.reason
      };

      if (form.type === 'Time Range') {
        postData.startTime = form.startTime;
        postData.endTime = form.endTime;
      }

      await axios.post(`${API}/api/slot-blocks`, postData);
      setSuccess('Slot block created successfully!');

      // Reset form but preserve branch
      setForm({
        date: '',
        type: 'Full Day',
        startTime: '10',
        endTime: '13',
        branch: form.branch,
        reason: ''
      });

      fetchBlocks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to block slots');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this slot/date?')) return;
    try {
      await axios.delete(`${API}/api/slot-blocks/${id}`);
      fetchBlocks();
      setSuccess('Unblocked successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Failed to delete slot block');
    }
  };

  const getHourLabel = (val, list = HOUR_OPTIONS) => {
    const found = list.find(o => o.value === val);
    return found ? found.label : `${val}:00`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-gray-500 font-cinzel text-lg">
        <div className="w-8 h-8 rounded-full animate-spin border-2 border-gray-200 border-t-[#D4AF37] mr-3" />
        Loading Slot Blocks...
      </div>
    );
  }

  return (
    <div className="bg-[#FDFDFD] min-h-screen p-4 md:p-8 font-sans text-gray-900">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-cinzel uppercase tracking-wide text-gray-900 flex items-center gap-3">
          <CalendarOff size={26} className="text-[#D4AF37]" />
          Slot Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manually block booking dates or specific hourly ranges for studios/staff availability.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          PREMIUM VISUAL CALENDAR SECTION
      ══════════════════════════════════════════════ */}
      <div style={{ marginBottom: 36 }}>
        {/* Section Label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 18,
        }}>
          <div style={{
            width: 3, height: 22, borderRadius: 2,
            background: 'linear-gradient(180deg, #D4AF37 0%, #B8960C 100%)',
          }} />
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#374151',
          }}>
            Visual Calendar Overview
          </span>
          <span style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.58rem',
            color: '#D4AF37',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 20,
            padding: '2px 10px',
            fontWeight: 600,
          }}>
            Click any date to inspect
          </span>
        </div>

        {/* Calendar + Detail Panel — side by side on md+, stacked on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 380px) 1fr',
          gap: 24,
          alignItems: 'start',
        }}
          className="cal-grid"
        >
          <PremiumCalendar
            blocks={blocks}
            selectedDate={selectedCalDate}
            onSelectDate={setSelectedCalDate}
          />
          <DateDetailPanel
            selectedDate={selectedCalDate}
            blocks={blocks}
            onUnblock={handleDelete}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          EXISTING SLOT MANAGEMENT UI (UNCHANGED)
      ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BLOCK SLOTS FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sticky top-6">
            <h3 className="text-sm font-cinzel font-bold uppercase tracking-wide mb-4 pb-3 text-gray-700" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              Add Slot Block
            </h3>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg mb-4 border border-red-100">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 text-xs rounded-lg mb-4 border border-green-100">
                <Check size={16} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Branch */}
              <div>
                <label className="block text-[0.65rem] font-cinzel font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Select Branch
                </label>
                <select
                  value={form.branch}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 text-sm transition-all"
                >
                  <option value="All">All Branches</option>
                  <option value="Chennai">Chennai Branch</option>
                  <option value="Madurai">Madurai Branch</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[0.65rem] font-cinzel font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 text-sm transition-all"
                  required
                />
              </div>

              {/* Block Type */}
              <div>
                <label className="block text-[0.65rem] font-cinzel font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Block Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'Full Day' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg font-cinzel tracking-wider uppercase border transition-all ${
                      form.type === 'Full Day'
                        ? 'bg-[#111] text-white border-[#111]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Full Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'Time Range' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg font-cinzel tracking-wider uppercase border transition-all ${
                      form.type === 'Time Range'
                        ? 'bg-[#111] text-white border-[#111]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Time Range
                  </button>
                </div>
              </div>

              {/* Time Range selection */}
              {form.type === 'Time Range' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/40 border border-amber-100 rounded-xl">
                  <div>
                    <label className="block text-[0.55rem] font-cinzel font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Start Time
                    </label>
                    <select
                      value={form.startTime}
                      onChange={e => setForm({ ...form, startTime: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] bg-white text-xs"
                    >
                      {HOUR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.55rem] font-cinzel font-bold uppercase tracking-wider text-gray-600 mb-1">
                      End Time
                    </label>
                    <select
                      value={form.endTime}
                      onChange={e => setForm({ ...form, endTime: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] bg-white text-xs"
                    >
                      {END_HOUR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-[0.65rem] font-cinzel font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Reason / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="e.g. Studio Maintenance, Staff Holiday"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] bg-gray-50 text-sm transition-all font-cormorant text-base text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg bg-[#111] text-white hover:bg-black"
              >
                <Plus size={16} /> Block Slots
              </button>
            </form>
          </div>
        </div>

        {/* LIST ACTIVE BLOCKED SLOTS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">
                Active Slot &amp; Day Blocks
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              {blocks.length === 0 ? (
                <div className="p-16 text-center text-gray-400 font-cormorant italic text-lg">
                  No blocked days or slots currently. All time slots are open.
                </div>
              ) : (
                blocks.map((block) => (
                  <div
                    key={block._id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-[#FFFCF5]/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                        <CalendarOff size={18} style={{ color: '#D4AF37' }} />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#111] font-mono text-sm tracking-wide">
                            {new Date(block.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>

                          <span className={`px-2 py-0.5 text-[0.6rem] rounded-full font-semibold uppercase tracking-wider font-cinzel ${
                            block.type === 'Full Day'
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {block.type}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[0.65rem] text-gray-500 font-medium font-cinzel">
                            <MapPin size={11} className="text-[#D4AF37]" />
                            {block.branch === 'All' ? 'All Branches' : `${block.branch} Only`}
                          </span>
                        </div>

                        {block.type === 'Time Range' && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <Clock size={12} className="text-gray-400" />
                            <span>
                              {getHourLabel(block.startTime)} &rarr; {getHourLabel(block.endTime, END_HOUR_OPTIONS)}
                            </span>
                          </div>
                        )}

                        {block.reason && (
                          <p className="text-xs text-gray-500 font-cormorant italic text-sm mt-1">
                            &ldquo;{block.reason}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:justify-end">
                      <button
                        onClick={() => handleDelete(block._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider transition-all"
                        title="Unblock Slots"
                      >
                        <Trash2 size={13} />
                        Unblock
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive styles for calendar grid ── */}
      <style>{`
        @media (max-width: 768px) {
          .cal-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .cal-grid {
            grid-template-columns: minmax(0, 340px) 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SlotManagement;
