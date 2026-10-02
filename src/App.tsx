import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { SidequestProvider } from './state/SidequestProvider'
import { DiscoverView } from './views/DiscoverView'
import { ActivityRoute } from './views/ActivityRoute'
import { PlansView } from './views/PlansView'
import { AddMemoryRoute } from './views/AddMemoryRoute'
import { MemoriesView } from './views/MemoriesView'
import { EditMemoryRoute } from './views/EditMemoryRoute'
import './App.css'

export default function App() {
  return (
    <SidequestProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/discover" replace />} />
          <Route path="discover" element={<DiscoverView />} />
          <Route path="activities/:experienceId" element={<ActivityRoute />} />
          <Route path="plans" element={<PlansView />} />
          <Route path="memories" element={<MemoriesView />} />
          <Route path="memories/new" element={<AddMemoryRoute />} />
          <Route path="memories/:memoryId/edit" element={<EditMemoryRoute />} />
          <Route path="*" element={<ActivityRoute />} />
        </Route>
      </Routes>
    </SidequestProvider>
  )
}
