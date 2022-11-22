
import { Routes, Route } from 'react-router-dom';
import ClientTest from './ClientTest';
import CounselorTest from './CounselorTest';
import First from './First';
function App() {
  return (
    <Routes>
      <Route path='*' element={<First/>}/>
      <Route path='/counselor' element={<CounselorTest/>}/>
      <Route path='/client' element={<ClientTest/>}/>
    </Routes>
  )
}

export default App;
