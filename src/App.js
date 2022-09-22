import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/Welcome'
import UsersList from './features/users/UsersList'
import NotesList from './features/notes/NotesList'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Will require authentication */}
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />

          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>

          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>

        </Route>{/* /dash */}

      </Route>
    </Routes>
  );
}

export default App;
