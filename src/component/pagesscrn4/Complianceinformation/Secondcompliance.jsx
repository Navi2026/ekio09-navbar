import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../Pages.css";
import axiosInstance from "../../../interceptors/axios";

const Secondpage = () => {
  const history = useHistory();
  const [complianceData, setComplianceData] = useState([]);


// Calls APIs HERE ---------------------------------------------------------

  useEffect(() => {
    axiosInstance.get(`/compliance/?category=${localStorage.getItem("category")}&product=${localStorage.getItem("product")}&region=${localStorage.getItem("region")}`)
    .then(res => {
      const uniqueComplianceData = [];
      res?.data?.data.forEach(compliance => {
        // check if the compliance id already exists in the array
        if (!uniqueComplianceData.some(item => item.id === compliance.id)) {
          uniqueComplianceData.push(compliance);
        }
      });
      setComplianceData(uniqueComplianceData);
    }) 
    .catch(err => {
      alert('Something went wrong.')
    });

}, []);


  // open compliance video in new window
  const handleVideoClick = (e, videoUrl) => {
    e.preventDefault();
    window.open(videoUrl, "Compliance Video", "width=800,height=600");
  };

  // navigate to compliance page based on compliance name
  const handleClick = (complianceName, complianceId) => {
    localStorage.setItem("compliance_id", complianceId);
    if (complianceName === "TEC") {
      history.push(`/navbar/TECcompliance`);
    } else if (complianceName === "WPS") {
      history.push(`/navbar/compliance/WPS`);
    } else if (complianceName === "BIS") {
      history.push(`/navbar/BIScompliance`);
    } else {
      // handle other compliance names
    }
  };



  return (
    <div className="table-bgsconpage">
    <div className="table">
      <h1>List of Compliance</h1>
      <div className="table-wrapper">
        <table className="Review">
          <thead>
            <tr>
         {/*     <th>S.no</th> */}
              <th style={{ cursor: 'default' }}>Compliance Name</th>
              <th style={{ cursor: 'default' }}>Description</th>
              <th style={{ cursor: 'default' }}>Video</th>
            </tr>
          </thead>
          <tbody>
  {complianceData.map((compliance, index) => (
    
    <tr key={index}>
      {/* <td>{compliance.id}</td> */}
      <td
        className="clickable"
        onClick={() => handleClick(compliance.product_name, compliance.id)}
      > 
        {compliance.product_name}
      </td>
                <td style={{ cursor: 'default' }}>{compliance.details}</td>
                <td>
                  {/* display compliance video */}
                  <a
                    href={compliance.video}
                    onClick={(e) => handleVideoClick(e, compliance.video)}
                  >
                    <div className="video-banner">
                      <div className="play-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default Secondpage;