import React, { useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../../interceptors/axios";
import ReactLoading from "react-loading";

function BISUploadDoc({ onClose }) {
  const bisApplicationId = localStorage.getItem('bisapplication_id');
  const bisComplianceId = localStorage.getItem('biscompliance_id');
  const [isLoading, setIsLoading] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [uploads, setUploads] = useState([]);

  const options = [
    'Business License',
    'ISO',
    'Trademark Certificate',
    'AadharCard',
    'PanCard',
    'GST',
    'Employee ID/Visiting Card',
    'MSME',
    'Form 3 (AFFIDAVIT)'
  ];

  function handleUpload() {
    setIsLoading(true); // Start loading animation

    const formData = new FormData();
    for (let i = 0; i < uploads.length; i++) {
      formData.append('document', uploads[i]);
    }
    formData.append('application', bisApplicationId);
    formData.append('compliance', bisComplianceId);
    formData.append('document_type', documentType);
    formData.append('status', 'Submitted');

    axiosInstance
      .post('application/document/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        console.log(res);
        const uploadStatus = res.data.status; // Assuming the response contains a status field

        if (uploadStatus) {
          Swal.fire({
            icon: 'success',
            title: 'Upload Success',
            text: 'Your documents have been uploaded successfully',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Sorry, there was an error uploading your documents',
            confirmButtonText: 'OK'
          });
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Sorry, there was an error uploading your documents',
          confirmButtonText: 'OK'
        });
      })
      .finally(() => {
        setIsLoading(false); // Stop loading animation
        onClose(); // Close the popup after download is complete or there was an error
      });
  }

  return (
    <div>
      <div>
        <h3>Upload a File</h3>
        <input type="file" name="file" multiple onChange={(e) => setUploads(e.target.files)} />
      </div>
      <div>
        <select className="optionss" value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
          <option value="">Select Document Type</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div>
        <button className="btn809" onClick={handleUpload}>UPLOAD</button>
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <ReactLoading type="spin" color="#fff" height={50} width={50} />
        </div>
      )}
    </div>
  );
}

export default BISUploadDoc;
