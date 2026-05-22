import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ProjectDetails from './ProjectDetails';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/projects`).then(response => {
      setProjects(response.data);
    });
  }, []);

  const createProject = () => {
    axios.post(`${API_URL}/projects`, { name: projectName }).then(response => {
      setProjects([...projects, response.data]);
      setProjectName('');
    });
  };

  const selectProject = project => {
    setSelectedProject(project);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Agentic Supply Chain</h1>

      <div className="card">
        <div className="card-header">Create New Project</div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Project Name"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
            />
            <button className="btn btn-primary" type="button" onClick={createProject}>
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h2>Projects</h2>
        <div className="list-group">
          {projects.map(project => (
            <button
              key={project.id}
              type="button"
              className={`list-group-item list-group-item-action ${
                selectedProject && selectedProject.id === project.id ? 'active' : ''
              }`}
              onClick={() => selectProject(project)}
            >
              {project.name}
            </button>
          ))}
        </div>
      </div>

      {selectedProject && <ProjectDetails project={selectedProject} setProjects={setProjects} />}
    </div>
  );
}

export default App;


