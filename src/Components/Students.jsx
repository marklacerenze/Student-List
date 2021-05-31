import React, { useState, useEffect, Component } from 'react';

function Student() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [open, setOpen] = useState([]);

  // useEffect to load the students API
  useEffect(() => {
    fetch("https://www.hatchways.io/api/assessment/students")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setStudents(result.students);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  // useEffect to load the filter
  useEffect(() => {
    setFilteredStudents(
      students.filter(s => {
        return s.firstName.toLowerCase().includes(search.toLowerCase())
          || s.lastName.toLowerCase().includes(search.toLowerCase());
      })
    )
  }, [search, students]);

  // This function works with the '+' symbol to see more options
  const toggleOpen = (id) => {
    if (open.includes(id)) {
      setOpen(open.filter(sid => sid !== id))
    } else {
      let newOpen = [...open]
      newOpen.push(id)
      setOpen(newOpen)
    }
  }

  if (error) {
    return <div className='container bg-dark text-danger'>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div className='col-auto mt-10 p-5 container text-center text-white bg-secondary'><h4>Loading...</h4></div>;
  } else {
    return (
      <div className="container p-3 rounded">
        <ul className="container list-group">
          <form className='form-group'>
            <input
              className='form-control border-0 border-bottom'
              type="text"
              placeholder="Search by Name"
              onChange={e => setSearch(e.target.value)}
            />
          </form>
          {filteredStudents.map(student => (
            <div className='container rounded bg-white border-bottom d-flex' style={{'list-style': 'none'}}>
              <li className='container p-2' key={student.id} style={{'list-style': 'none'}}>
                <img className='img-fluid' src={student.pic} alt="student" width='10%' style={{'borderRadius': '50%', 'border': '1px solid lightgray'}}></img>
                <div className='container mt-2' style={{'position': 'absolute', 'left': '80vw'}}>
                  <button className='btn btn-light btn-lg' alt='More' onClick={() => toggleOpen(student.id)}>{open.includes(student.id) ? '-' : '+'}</button>
                </div>
                <div className='container'>
                  <h1 className='text-uppercase mt-2'>{student.firstName}  {student.lastName}</h1>
                  <p className='text-secondary'>Email: {student.email}</p>
                  <p className='text-secondary'>Company: {student.company}</p>
                  <p className='text-secondary'>Skill: {student.skill}</p>
                  <p className='text-secondary'>Average: {(student.grades.reduce((a, b) => parseInt(b) + a, 0))
                    / (student.grades.map((grade) => grade).length)}%
                  </p>
                  <div className='container'>
                    {open.includes(student.id) ? ( 
                      <ul className='container text-secondary'>
                        {student.grades.map((grade, index) => <li key={grade.id}>Test {index + 1}: {grade}%</li>)}
                      </ul>) : null}
                  </div>
                </div>
              </li>
            </div>
          ))
          };
        </ul >
      </div>
    );

  }
}

export default Student;