import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    category: '',
    title: '',
    duration: '',
    learnings: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // 🔥 FETCH COURSES
  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔥 ADD COURSE (FIXED WITH TOKEN)
  const handleAdd = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.post(
        'http://localhost:5000/api/courses',
        {
          ...newCourse,
          learnings: newCourse.learnings.split(',')
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNewCourse({ category: '', title: '', duration: '', learnings: '' });
      fetchCourses();

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 DELETE (FIXED WITH TOKEN)
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`http://localhost:5000/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchCourses();
      alert("Deleted successfully");

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // 🔥 EDIT START
  const handleEdit = (course) => {
    setEditingId(course._id);
    setEditData({
      ...course,
      learnings: course.learnings.join(',')
    });
  };

  // 🔥 SAVE EDIT (FIXED WITH TOKEN)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `http://localhost:5000/api/courses/${editingId}`,
        {
          ...editData,
          learnings: editData.learnings.split(',')
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setEditingId(null);
      fetchCourses();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Course Management</h1>

      {/* ADD FORM */}
      <div className="bg-white p-6 rounded shadow mb-8 space-y-4">

        {/* ✅ DROPDOWN CATEGORY */}
        <select
          value={newCourse.category}
          onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Select Category</option>
          <option value="beautician">Beautician</option>
          <option value="fashion">Fashion</option>
          <option value="embroidery">Embroidery</option>
          <option value="jewellery">Jewellery</option>
          <option value="bags">Bags</option>
          <option value="kids">Kids</option>
          <option value="special">Special</option>
        </select>

        <input
          placeholder="Course Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Duration"
          value={newCourse.duration}
          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Learnings (comma separated)"
          value={newCourse.learnings}
          onChange={(e) => setNewCourse({ ...newCourse, learnings: e.target.value })}
          className="border p-2 w-full"
        />

        <button
          onClick={handleAdd}
          className="admin-btn-primary"
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {courses.map(course => (
          <div key={course._id} className="bg-white p-4 rounded shadow">

            {editingId === course._id ? (
              <>
                <input
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="border p-2 w-full mb-2"
                />

                <input
                  value={editData.duration}
                  onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
                  className="border p-2 w-full mb-2"
                />

                <input
                  value={editData.learnings}
                  onChange={(e) => setEditData({ ...editData, learnings: e.target.value })}
                  className="border p-2 w-full mb-2"
                />

                <div className="flex gap-2">
                  <button onClick={handleSave} className="admin-btn-primary">
                    <Save size={16} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1">
                    <X size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.category}</p>
                <p>{course.duration}</p>

                <ul className="list-disc ml-5 text-sm">
                  {course.learnings?.map((l, i) => <li key={i}>{l}</li>)}
                </ul>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(course)} className="text-blue-500">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(course._id)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCourses;