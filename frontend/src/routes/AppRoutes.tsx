import { Navigate, Route, Routes } from 'react-router-dom'

import { DashboardLayout } from '../layouts/DashboardLayout'
import { DashboardPage } from '../pages/Dashboard'
import { LoginPage } from '../pages/Login'
import { PropertiesListPage } from '../pages/Properties/PropertiesList'
import { PropertyFormPage } from '../pages/Properties/PropertyFormPage'
import { PropertyDetailsPage } from '../pages/Properties/PropertyDetails'
import { InspectionsListPage } from '../pages/Inspections/InspectionsList'
import { InspectionDetailsPage } from '../pages/Inspections/InspectionDetails'
import { InspectionFormPage } from '../pages/Inspections/InspectionFormPage'
import { ProfilePage } from '../pages/Profile'
import { PrivateRoute } from './PrivateRoute'

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />

    <Route
      element={
        <PrivateRoute>
          <DashboardLayout />
        </PrivateRoute>
      }
    >
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/properties" element={<PropertiesListPage />} />
      <Route path="/properties/new" element={<PropertyFormPage />} />
      <Route path="/properties/:id" element={<PropertyDetailsPage />} />
      <Route path="/properties/:id/edit" element={<PropertyFormPage />} />

      <Route path="/inspections" element={<InspectionsListPage />} />
      <Route path="/inspections/new" element={<InspectionFormPage />} />
      <Route path="/inspections/:id" element={<InspectionDetailsPage />} />
      <Route path="/inspections/:id/edit" element={<InspectionFormPage />} />

      <Route path="/profile" element={<ProfilePage />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

