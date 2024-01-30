import { useEffect, useState } from "react";
import axiosInstance from "../../../../interceptors/axios";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

export default function RenewalTable() {
  const [tableData, setTableData] = useState([]);
  const idel = localStorage.getItem('ide');

  useEffect(() => {
    async function populateData() {
      try {
        const response = await axiosInstance.get(`application/compliance/${idel}/`);
        const data = response.data.data;
        console.log(data.uniqueid, data.application_name);
        console.log(data);
        setTableData([data]); // Assuming data is an object, wrap it in an array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    populateData();

  }, [idel]);

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
              <th className="header" style={{ cursor: "default" }}>
                Date of Registration
              </th>
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
                <td className="clickable1">{formatDate(rowData.startdate)}</td>
                <td style={{ cursor: "default" }}>{rowData.compliance_name}</td>
                <td style={{ cursor: "default" }}>{rowData.certificate_expiry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
