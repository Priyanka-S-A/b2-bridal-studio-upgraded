import React from "react";

const Certificate = () => {
  const certificates = [
    { img: "/images/cert1.jpeg", title: "Advanced Beautician" },
    { img: "/images/cert2.jpeg", title: "Aari Embroidery" },
    { img: "/images/cert3.jpeg", title: "Vaishnavi Jain" },
    { img: "/images/cert4.jpeg", title: "Fruits & Vegetable Processing" },
    { img: "/images/cert5.jpeg", title: "Bakery Products" },
    { img: "/images/cert6.jpeg", title: "Homemade Chocolate Making" },
    { img: "/images/cert7.jpeg", title: "Imitation Jewellery" },
    { img: "/images/cert8.jpeg", title: "Digital Marketing" },
    { img: "/images/cert9.jpeg", title: "Classic Haircut Seminar" },
    { img: "/images/cert10.jpeg", title: "Palm Leaf Fancy Articles Making" },
    // 👉 add up to 20–25 like this
  ];

  return (
    <div style={{ background: "#000" }}>

      {/* TOP SECTION */}
      <div
        style={{
          padding: "60px 20px 30px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
          Certificates
        </h1>
        <p style={{ color: "#aaa" }}>
          Our Achievements & Training Programs
        </p>
      </div>

      {/* GRID SECTION */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "50px 20px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "25px",
          }}
        >
          {certificates.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
                transition: "0.3s",
              }}
            >
              {/* IMAGE CONTAINER */}
              <div
                style={{
                  width: "100%",
                  height: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fafafa",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.img}
                  alt="certificate"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* TITLE */}
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#000",
                }}
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Certificate;