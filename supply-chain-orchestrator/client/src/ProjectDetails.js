import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ProjectDetails = ({ project, setProjects }) => {
  const [brd, setBrd] = useState(project.brd);
  const [forecast, setForecast] = useState('');

  const updateBrd = () => {
    axios.post(`${API_URL}/projects/${project.id}/brd`, { brd }).then(response => {
      setProjects(prevProjects =>
        prevProjects.map(p => (p.id === project.id ? response.data : p))
      );
    });
  };

  const sendToEms = () => {
    axios.post(`${API_URL}/projects/${project.id}/ems`).then(response => {
      setProjects(prevProjects =>
        prevProjects.map(p => (p.id === project.id ? response.data : p))
      );
    });
  };

  const generatePurchaseOrders = () => {
    axios
      .post(`${API_URL}/projects/${project.id}/forecast`, { forecast })
      .then(response => {
        setProjects(prevProjects =>
          prevProjects.map(p => (p.id === project.id ? response.data : p))
        );
      });
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">{project.name}</h5>
        <p>Status: {project.status || 'New'}</p>
        <div className="mb-3">
          <label htmlFor={`brd-${project.id}`} className="form-label">
            Business Requirements Document (BRD)
          </label>
          <textarea
            className="form-control"
            id={`brd-${project.id}`}
            rows="5"
            value={brd}
            onChange={e => setBrd(e.target.value)}
          ></textarea>
        </div>
        <button className="btn btn-secondary" onClick={updateBrd}>
          Generate BOM
        </button>

        {project.bom && project.bom.length > 0 && (
          <div className="mt-4">
            <h6>Bill of Materials (BOM)</h6>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {project.bom.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item}</td>
                    <td>{item.quantity}</td>
                    <td>${item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn btn-info" onClick={sendToEms}>
              Send to EMS
            </button>
          </div>
        )}

        {project.finalizedBom && project.finalizedBom.length > 0 && (
          <div className="mt-4">
            <h6>Finalized BOM from EMS</h6>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {project.finalizedBom.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item}</td>
                    <td>{item.quantity}</td>
                    <td>${item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="input-group mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Sales Forecast"
                value={forecast}
                onChange={e => setForecast(e.target.value)}
              />
              <button
                className="btn btn-success"
                type="button"
                onClick={generatePurchaseOrders}
              >
                Generate Purchase Orders
              </button>
            </div>
          </div>
        )}

        {project.purchaseOrders && project.purchaseOrders.length > 0 && (
          <div className="mt-4">
            <h6>Purchase Orders</h6>
            <table className="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {project.purchaseOrders.map((po, index) => (
                        <tr key={index}>
                            <td>{po.item}</td>
                            <td>{po.quantity}</td>
                            <td>${po.totalCost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;

