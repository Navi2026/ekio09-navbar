import React, { useState, useEffect } from "react";
import "../../../pages/stepper.css";
import Popup from "../../../popup/Popup";
import Message from "../../../popup/Message";
import axiosInstance from "../../../../interceptors/axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReactLoading from "react-loading";
import { FcDocument } from "react-icons/fc";
import { FiUpload, FiDownload } from "react-icons/fi";
// import { ReactComponent as Wrong } from "../../../assets/trckpg-rb/wrong.svg";
// import { ReactComponent as Right } from "../../../assets/trckpg-rb/right.svg";
// import file6png from "../../../assets/pdficon/Red02.png";
import pdflogo from "../../../assets/icons/eikomp_logo.png";
import StatusBar from "../../../Statusbar";
// import BISChatbot from "../../../Chatbot/BISChatbot";
import BEEUploaddoc from "../BEEUploaddoc";
import BEErequsting from "../BEErequsting";
import BEESteps from "../BEESteps";


function BEEonGoing() {
  const [docStatus, setDocStatus] = useState({});
  const [uniqueid, setUniqueid] = useState("");
  const [complianceid, setComplianceid] = useState("");
  const idel = localStorage.getItem("ide");
  const [testingbtnkey, setTestingbtnkey] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);
  // const [buttonPopup1, setButtonPopup1] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const totalResponses = 5;
  const completedResponses = localStorage.getItem("stepstatus");
  const [docReport, setDocReport] = useState("");
  const [docType, setDocType] = useState("");
  const beeDocStep = JSON.parse(localStorage.getItem("beedocStep"));

  //POPUP BUTTONS OF STEPS
  const [buttonPopupreport, setButtonPopupreport] = useState(false);

  //LAB TESTING FROM CONST HERE ---------------------------------------
  const [buttonPopup2, setButtonPopup2] = useState(false);
  //const [buttonPopup1, setButtonPopup1] = useState(false);

  // API call to get document status

  useEffect(() => {
    const interval = setInterval(() => {
      axiosInstance.get(`application/compliance/${idel}/`);
      console.log("Refreshing Data..!!");
      axiosInstance
        .get(`application/compliance/${idel}/`)
        .then((response) => {
          const data = response.data.data;
          const beecompliance_id = data["compliance"];
          const beeapplication_id = data["application"];
          const beerequest_for = data["request_for"];
          // setCompliance_id1(compliance_id);
          // setApplication_id1(application_id);
          console.log(beecompliance_id);
          console.log(beeapplication_id);

          console.log(data);
          // store local storage then show the values
          setUniqueid(data["uniqueid"]);
          setComplianceid(data["compliance_name"]);
          setTestingbtnkey(data["testing"]);
          console.log(data["testing"]);

          const compliancename = data["compliance_name"];
          localStorage.setItem("compliance_name", compliancename);

          //IMPORTANT COMMENT    //Store Compliance ID and Application ID BIS USE FOR TEC UPLOAD LOCALSTORAGE FOR TEC UPLOAD DOC
          localStorage.setItem("beecompliance_id", beecompliance_id);
          localStorage.setItem("beeapplication_id", beeapplication_id);
          localStorage.setItem("beerequest_for", beerequest_for);

          //Notification DATA SET HERE ----------------------------------------------------
          // const notificationData = data["notifications"]
          // console.log(notificationData)
          // setNotifiData(notificationData)

          axiosInstance
            .get(
              `application/document/?compliance=${beecompliance_id}&application=${beeapplication_id}`
            )
            .then((response) => {
              const beedocumentData = response.data.data;
              //console.log(response.data.key)

              localStorage.setItem("report", response.data.report);
              localStorage.setItem("certificate", response.data.certificate);
              //  console.log(response.data.key)

              //store button APIS data here button name download report and download certificate

              const docReport = {};
              const docCertificate = {};

              response.data.data.forEach((item) => {
                const documentType = item.document_type;
                const fileType = item.document;

                if (documentType.toLowerCase().includes("report_")) {
                  docReport[documentType] = fileType;
                }

                if (documentType.includes("certificate_")) {
                  docCertificate[documentType] = fileType;
                }
              });

              // Assuming you want to store these objects in the state variables 'setdocreport' and 'setdoctype'
              setDocReport(docReport);
              setDocType(docCertificate);

              const docStatus = {};
              for (let i = 0; i < beedocumentData.length; i++) {
                const statusData = beedocumentData[i];
                docStatus[statusData["document_type"]] = statusData["status"];
              }
              setDocStatus(docStatus);
              console.log(docStatus);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [idel]);

  //Download Button Code handleOptionClick

  const handleDownloadreport = () => {

    setIsLoading(true); // Start loading animation
    // create a new instance of jsPDF
    const doc = new jsPDF();

    //load the image
    const logoImg = new Image();
    logoImg.src = pdflogo;

    //wait for the image to load
    logoImg.onload = function() {
      // Add the content to the PDF
      doc.addImage(logoImg, "PNG", 10, 4, 50, 30);
      doc.text(`Compliance Type: ${complianceid}`, 10, 50);
      doc.text(`Application Number: ${uniqueid}`, 10, 60);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 70);
      doc.text("Details of Documents:-", 10, 160);
      //add despriction

      // Define the table columns and rows
      const columns = ["Step Name", "Start Date", "Status"];
      const rows = [
        [
          "Portal Registration",
          beeDocStep["1"] && beeDocStep["1"][2].slice(0, 10),
          beeDocStep["1"] && beeDocStep["1"][0],
        ],
        [
          "Sample Testing",
          beeDocStep["2"] && beeDocStep["2"][2].slice(0, 10),
          beeDocStep["2"] && beeDocStep["2"][0],
        ],
        [
          "Documentation",
          beeDocStep["3"] && beeDocStep["3"][2].slice(0, 10),
          beeDocStep["3"] && beeDocStep["3"][0],
        ],
        [
          "Filling Application",
          beeDocStep["4"] && beeDocStep["4"][2].slice(0, 10),
          beeDocStep["4"] && beeDocStep["4"][0],
        ],
        [
          "Approval",
          beeDocStep["5"] && beeDocStep["5"][2].slice(0, 10),
          beeDocStep["5"] && beeDocStep["5"][0],
        ],
      ];

      // Generate the table using jspdf-autotable
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 75,
      });

      //SECOND TABLE DATA
      const columns1 = ["Step Name", "Status"];
      const rows1 = [
        ["List Of Retailers", docStatus["List Of Retailers"]],
        ["Upload Company Documents", docStatus["Upload Company Documents"]],
        ["Trade Mark and Company Registration certificate", docStatus["Trade Mark and Company Registration certificate"]],
        ["Quality Management System Certificate (ISO 9001)", docStatus["Quality Management System Certificate (ISO 9001)"]],
        ["Authorized Letter for Signatory", docStatus["Authorized Letter for Signatory"]],
        ["ID Proof of Authorized Signatory", docStatus["ID Proof of Authorized Signatory"]],
      ];

      // Generate the table using jspdf-autotable
      doc.autoTable({
        head: [columns1],
        body: rows1,
        startY: 170,
      });
      // Save the PDF
      doc.save("Progress Tracker.pdf");
      setIsLoading(false); // Stop loading animation
    };
  };

  /*-------------------------------------------handleOptions download report----------------------------------*/
  const ReportOptionClick = (option) => {
    const reportKey = localStorage.getItem("report");
    console.log(reportKey);
    if (reportKey === "Yes") {
      // Create a popup window
    }
  };

  const CertificateOptionClick = (option) => {
    const certificateKey = localStorage.getItem("certificate");
    console.log(certificateKey);
    if (certificateKey === "Yes") {
      console.log(docType);
      var newWindow = window.open(Object.values(docType)[0], "_blank");
      newWindow.focus();
    }
  };


   //Auto close POPup after click Sumbit
   const handlePopupClose = () => { 
    setButtonPopup(false);
    setButtonPopup2(false);
    // setButtonPopup1(false);
   }


  return (
    <div className="bgchangecompleted">
      <div className="ongoing-applications">
        <h1 className="ongo">BEE Ongoing Application</h1>
        <div className="ongoing-title">
          <h1 className="type">Compliance Type: {complianceid} </h1>
          <h1 className="appli">Application Number: {uniqueid} </h1>
          {/* <button className="clidown" onClick={handleDownload}>Download</button> */}
        </div>

        {/*----------------UPLOAD BUTTON CODE ------------*/}
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <BEEUploaddoc  onClose={handlePopupClose} />
        </Popup>

        {/*-----------LAB TESTING JSX CODE IS HERE----------*/}

        <div className="lab-testing-box">
          <Popup trigger={buttonPopup2} setTrigger={setButtonPopup2}>
            <BEErequsting onClose={handlePopupClose} />
          </Popup>
        </div>

        {/*------------------DOWNLOAD BUTTON CODE ----------------*/}

        <div className="header-btn1">
          <button
            className="testreq-btn"
            onClick={() => setButtonPopup2(true)}
            disabled={testingbtnkey === "Yes"}
          >< FcDocument />
            Request Testing
          </button>
          <button className="upload-btn" onClick={() => setButtonPopup(true)}>
          < FiUpload />
            Upload
          </button>
          {/* <button className="download-btn" onClick={() => setButtonPopup1(true)}>
          <FiDownload />
            Download
          </button> */}
          {/* <button className='button7' onClick={() => setButtonPopup11(true)}>Notification</button> */}
        </div>

        {/*--------Ststus Bar CODE IS HERE --------------------*/}
        <div>
          <StatusBar
            totalResponses={totalResponses}
            completedResponses={completedResponses}
          />
        </div>
        {/* BIS STEPS SET HER MESSAGE AND ALL */}
        <BEESteps />

        {/* <h2 className="pdfstep-name"> Documents To Be Submitted</h2>
        <div className="pdffilesup">
          <div className="row1">
            <div className="col doc-col">
              {docStatus["Business License"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}
              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">Business License</h3>
            </div>

            <div className="col doc-col">
              {docStatus["ISO"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}
              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">ISO</h3>
            </div>

            <div className="col doc-col">
              {docStatus["Trademark Certificate"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}
              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">Trademark Certificate</h3>
            </div>

            <div className="col doc-col">
              {docStatus["AadharCard"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}

              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">AadharCard</h3>
            </div>

            <div className="col doc-col">
              {docStatus["PanCard"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}

              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">PanCard</h3>
            </div>

            <div className="col doc-col">
              {docStatus["GST"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}
              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">GST</h3>
            </div>

            <div className="col doc-col">
              {docStatus["Employee ID/Visiting Card"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}
              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">Employee ID/Visiting Card</h3>
            </div>

            <div className="col doc-col">
              {docStatus["MSME"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}
              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">MSME</h3>
            </div>

            <div className="col doc-col">
              {docStatus["Form 3 (AFFIDAVIT)"] === "Submitted" ? (
                <>
                  {" "}
                  <Right size={24} className="pdfico" />{" "}
                </>
              ) : (
                <Wrong size={24} className="pdfico" />
              )}
              <div>
                <img src={file6png} alt="" className="pdfico1" />
              </div>
              <h3 className="be">Form 3 (AFFIDAVIT)</h3>
            </div>
          </div>
        </div> */}

        {/* POPUP OF LAST BUTTON OF DOWNLOAD REPORT FUNCTION AS WELL  */}
        <Message trigger={buttonPopupreport} setTrigger={setButtonPopupreport}>
          <h1 style={{ color: "black", fontSize: "24px", textAlign: "center" }}>
            Download Test Report
          </h1>
          <ul>
            {Object.entries(docReport).map(
              ([documentType, fileDownloadLink]) => {
                const modifiedDocumentType = documentType.replace(
                  /report_/i,
                  ""
                );
                return (
                  <li key={documentType}>
                    <a
                      href={fileDownloadLink}
                      download={`${documentType}.${fileDownloadLink
                        .split(".")
                        .pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="button7">
                        {modifiedDocumentType}
                      </button>
                    </a>
                  </li>
                );
              }
            )}
          </ul>
        </Message>

        {/*------- LAST THREE BUTTON CODES HERE --------------------*/}

        <div className="dd-menu">
          <button className="reportbtn" onClick={handleDownloadreport}>
          <FiDownload />
            Download Progress Report
          </button>
          <button
            className="reportbtn"
            onClick={() => {
              ReportOptionClick();
              setButtonPopupreport(true);
            }}
            disabled={localStorage.getItem("report") === "No"}
          >
               <FiDownload />
            Download Test Report
          </button>

          <button
            className="reportbtn"
            onClick={CertificateOptionClick}
            disabled={localStorage.getItem("certificate") === "No"}
          >
               <FiDownload />
            Download Certificate
          </button>
        </div>

        {/* <BISChatbot /> */}
      </div>

      {isLoading && (
        <div className="loading-overlay">
          <ReactLoading type="spin" color="#fff" height={50} width={50} />
        </div>
      )}
    </div>
  );
}

export default BEEonGoing;
