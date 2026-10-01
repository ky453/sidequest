import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { SidequestProvider } from './state/SidequestProvider'
import { DiscoverView } from './views/DiscoverView'
import { ActivityRoute } from './views/ActivityRoute'
import './App.css'

export default function App() {
  return (
    <SidequestProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/discover" replace />} />
          <Route path="discover" element={<DiscoverView />} />
          <Route path="activities/:experienceId" element={<ActivityRoute />} />
          <Route path="*" element={<ActivityRoute />} />
        </Route>
      </Routes>
    </SidequestProvider>
  )
}
