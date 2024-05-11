import { useEffect, useState } from 'react'
import './App.css'
import './index.css';

function App() {
  const types = ['Feature', 'Bug', 'Information'];
  const tableHeadings = ['Ticket', 'Type', 'Learning', 'Action'];
  
  const [ticket, setTicket] = useState('')
  const [learning, setLearning] = useState('')
  const [type, setType] = useState('')
  const [search, setSearch] = useState('')
  const [learningData, setLearningData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [updatedData, setupdatedData] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [updatedDataId, setupdatedDataId] = useState('')
  
  const deleteText = 'Are you sure, you want to delete?'
  const deleteAndUpdateText = 'Are you sure, you want to update?'

  const addLearning = () => {
    if (search !== '') {
      setSearch('')
    }
    if (ticket === '' || learning === '' || type === '') {
      alert('Please enter all the details!')
      return
    }
    if (isUpdate) {
      const updatedItems = learningData.map(data => {
        if (data.id === updatedDataId) {
          return {
            ...updatedData,
            'id': updatedDataId,
            'ticket': updatedData?.ticket,
            'learning': updatedData?.learning,
            'type': updatedData?.type,
          }
        }
      }).filter(data => data !== undefined)
      deleteRow(updatedDataId, ...updatedItems)
    } else {
      setLearningData(prevData => [...prevData, { 'id': Math.floor(Math.random() * 1000) + 1, 'ticket': ticket, 'learning': learning, 'type': type }])
    }
    setLsLearningData()
    setTicket('');
    setLearning('');
    setType('')
    setIsUpdate(false)
  }

  const setLsLearningData = () => {
    localStorage.setItem('learningData', JSON.stringify(learningData))
  }

  const deleteRow = (indexToDelete, data = []) => {
    const lsData = JSON.parse(localStorage.getItem(('learningData')))
    if (confirm(isUpdate ? deleteAndUpdateText : deleteText)) {
      const filteredData = lsData.filter((data) => data.id !== indexToDelete)
      let indexToRemove = lsData.findIndex((data) => data.id === indexToDelete)
      if (search !== '') {
        if (indexToRemove !== -1 && !isUpdate) {
          lsData.splice(indexToRemove, 1)
          localStorage.setItem('learningData', JSON.stringify(lsData))
          setLearningData(lsData)
        } else if (isUpdate) {
          const d = [...filteredData, data]
          localStorage.setItem('learningData', JSON.stringify(d))
          setLearningData(d)
        }
      } else {
        if (isUpdate) {
          const d = [...filteredData, data]
          localStorage.setItem('learningData', JSON.stringify(d))
          setLearningData(d)
        } else {
          localStorage.setItem('learningData', JSON.stringify(filteredData))
          setLearningData(filteredData)
        }
      }
      setSearch('')
      // window.location.reload()
    }
  }

  const updateRow = (data) => {
    setupdatedDataId(data.id)
    setIsUpdate(true)
    setTicket(data.ticket);
    setType(data.type);
    setLearning(data.learning);
  }

  useEffect(() => {
    if (isUpdate) {
      setupdatedData({ 'ticket': ticket, 'learning': learning, 'type': type })
    }
  }, [ticket, learning, type])

  useEffect(() => {
    if (learningData?.length) {
      setLsLearningData()
    }
  }, [learningData])

  useEffect(() => {
    const lsLearningData = JSON.parse(localStorage.getItem('learningData'));
    if (lsLearningData !== null) {
      setLearningData(lsLearningData)
    }
  }, [])

  useEffect(() => {
    const lsData = JSON.parse(localStorage.getItem(('learningData')))
    if (lsData !== null) {
      const searchedValue = lsData.filter(data => data?.ticket?.includes(search));
      setFilteredData(searchedValue)
    }
  }, [search])

  const renderList = (data) => {
    return data.length > 0 ? data.map(data => {
      return (
        <tr key={data?.id} className="bg-gray-100">
          <td className="px-4 py-2 text-left">{data?.ticket}</td>
          <td className="px-4 py-2 text-left">{data?.type}</td>
          <td className="px-4 py-2 text-left">{data?.learning}</td>
          <td className="px-4 py-2 text-left"><button onClick={() => updateRow(data)} className="bg-blue-500 cursor-pointer text-white font-bold py-2 px-4 rounded"><i className='fa fa-edit'></i></button></td>
          <td className="px-4 py-2 text-left"><button onClick={() => deleteRow(data.id)} className="bg-red-500 cursor-pointer text-white font-bold py-2 px-4 rounded"><i className='fa fa-trash'></i></button></td>
        </tr>
      )
    }) : <tr><td>No Results Found!</td></tr>
  }
  return (
    <div className='w-full max-w-screen-sm p-[10px] rounded-lg m-auto border border-gray-400'>
      <h1 className='font-bold'>Learning Tracker</h1><br />
      <div className="flex">
        <div className="flex-1 px-4 py-2 m-2">
          <label htmlFor="ticket" className="block text-left text-sm font-medium leading-6 text-gray-900">Ticket</label>
          <input id='ticket' type="text" value={ticket} placeholder='Add Ticket Details' className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline' onChange={e => setTicket(e.target.value)} /><br />
        </div>
        <div className="flex-1 px-4 py-2 m-2">
          <label htmlFor="type" className="block text-left text-sm font-medium leading-6 text-gray-900">Type</label>
          <select name="" id="type" value={type} onChange={e => setType(e.target.value)} className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline' >
            <option value="">Select a type</option>
            {types.map(type => {
              return (
                <option key={type} value={type}>{type}</option>
              )
            })}
          </select><br />
        </div>
      </div>
      <div className="flex">
        <div className="flex-1 px-4 m-2">
          <label htmlFor="learning" className="block text-left text-sm font-medium leading-6 text-gray-900">Learning</label>
          <textarea id="learning" placeholder='Add Learning Details' name="learning" rows="4" cols="50" value={learning} onChange={e => setLearning(e.target.value)} className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline resize-none'>
          </textarea><br />
        </div>
      </div>
      <input type="button" value={`${isUpdate ? 'Update Learning' : 'Add Learning'}`} className="bg-black cursor-pointer text-white font-bold py-2 px-4 rounded" onClick={addLearning} />
      <br /><br />
      <div className="flex-1 px-4 py-2 m-2">
        <label htmlFor="search" className="block text-left text-sm font-medium leading-6 text-gray-900">Search</label>
        <input id='search' type="text" value={search} placeholder='Search by ticket' className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline' onChange={e => setSearch(e.target.value)} /><br />
      </div>
      {learningData?.length > 0 && <div className="flex-1 px-4 py-2 m-2">
        <table className="table-auto border w-full">
          <thead>
            <tr>
              {
                tableHeadings.map((heading, index) => {
                  return (
                    <th className="px-4 py-2 text-left" key={index}>{heading}</th>
                  )
                })
              }
            </tr>
          </thead>
          <tbody>
            {renderList(search !== '' ? filteredData : learningData)}
          </tbody>
        </table>
      </div>
      }
    </div>
  )
}

export default App