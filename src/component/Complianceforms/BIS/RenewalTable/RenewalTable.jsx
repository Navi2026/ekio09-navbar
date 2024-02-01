import { useEffect, useState } from "react";
import axiosInstance from "../../../../interceptors/axios";

function formatDate(dateString) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function RenewalTable() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    async function populateData() {
      try {
        let idelList = JSON.parse(localStorage.getItem('allIds')) || [];
        console.log("Idel List:", idelList); // Debug: Check the idelList
  
        // Ensure idelList is always an array
        if (!Array.isArray(idelList)) {
          idelList = [idelList]; // Convert to an array if it's not
        }
  
        if (idelList.length === 0) {
          console.warn("No idel data found in localStorage");
          return;
        }
  
        // Using Promise.all to handle multiple requests
        const requests = idelList.map(idel =>
          axiosInstance.get(`application/compliance/${idel}/`)
        );
  
        // Waiting for all requests to complete
        const responses = await Promise.all(requests);
        const allData = responses.map(response => response.data.data);
  
        console.log("All Data Collected:", allData); // Debug: Check the collected data
        setTableData(allData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    populateData();
  }, []);
  

  return (
    <>
      <div className="table-wrapper">
        <table className="Review">
          <thead>
            <tr>
              <th className="header" style={{ cursor: "default" }}>
                S.No
              </th>
              <th className="header" style={{ cursor: "default" }}>
                Name Of Manufacturer
              </th>
              <th className="header" style={{ cursor: "default" }}>
                Product Name
              </th>
              <th className="header" style={{ cursor: "default" }}>
                Brand
              </th>
              <th className="header" style={{ cursor: "default" }}>
                Registration Number
              </th>
              {/* <th className="header" style={{ cursor: "default" }}>
                Date of Registration
              </th> */}
              <th className="header" style={{ cursor: "default" }}>
                Compliance Name
              </th>
              <th className="header" style={{ cursor: "default" }}>
                Date of Expiry
              </th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((rowData, index) => (
              <tr key={index}>
                <td className="clickable1">{index + 1}</td>
                <td className="clickable1">{rowData.fields?.Factory_name}</td>
                <td style={{ cursor: "default" }}>{rowData.application_name}</td>
                <td style={{ cursor: "default" }}>{rowData.fields?.Brand_trademark}</td>
                <td className="clickable1">{rowData.unique_number}</td>
                {/* <td className="clickable1">{formatDate(rowData.startdate)}</td> */}
                <td style={{ cursor: "default" }}>{rowData.compliance_name}</td>
                <td style={{ cursor: "default" }}>{formatDate(rowData.certificate_expiry)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
