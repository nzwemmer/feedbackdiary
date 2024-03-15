import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom' // Import useNavigate from react-router-dom
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser, cilWarning, cilCheckCircle } from '@coreui/icons'
import useToken from 'src/components/authentication/useToken'
// import { useEffect } from 'react'
import { useEffect } from 'react'


const ChangePasswordRequest = ( ) => {
//   const { token, setToken } = useToken();
  const navigate = useNavigate() // Create a navigate object
  const [resetRequested, setResetRequested] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
  })

  const [alertConfig, setAlertConfig] = useState({
    icon: null,
    color: 'info',
    visible: false,
    message: 'error',
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      if (!resetRequested) {
        
        const response = await fetch('/api/changepasswordrequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const responseData = await response.json();

        const color = response.ok ? 'success' : 'warning';
        const icon = response.ok ? cilCheckCircle : cilWarning;
        {response.ok ? setResetRequested(true) : setResetRequested(false) };

        setAlertConfig({
          icon: icon,
          color: color,
          visible: true,
          message: responseData.msg,
        }) 
      } else {
        setResetRequested(false);
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error during password reset request:', error)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Change password</h1>
                    {alertConfig.visible && (
                      <CAlert
                        color={alertConfig.color}
                        dismissible
                        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
                        className="d-flex align-items-center"
                      >
                        <CIcon
                          icon={alertConfig.icon}
                          className="flex-shrink-0 me-2"
                          width={24}
                          height={24}
                        />
                        <div>{alertConfig.message}</div>
                      </CAlert>
                    )}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        name="email"
                        placeholder="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4">
                          {resetRequested ? ( <> Go back to homepage </>) : (<> Send reset link</>)}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ChangePasswordRequest
