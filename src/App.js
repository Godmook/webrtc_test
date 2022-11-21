
import { Routes, Route } from 'react-router-dom';
import ClientTest from './ClientTest';
import CounselorTest from './CounselorTest';
function App() {
  return (
    <Routes>
      <Route path='*' element={<ClientTest/>}/>
      <Route path='/test' element={<CounselorTest/>}/>
    </Routes>
  )
}

export default App;
