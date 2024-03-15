import React, { useState, useEffect } from "react";

import jwt_decode from "jwt-decode";

import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { cilAccountLogout, cilLoopCircular, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import useToken from "src/components/authentication/useToken";

const AppHeaderDropdown = () => {
  const { token } = useToken();

  const [email, setEmail] = useState("User");

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      const userEmail = decodedToken.sub;
      setEmail(userEmail);
    }
  }, [token]); // Run only when token changes

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={true}>
        {email} <CIcon icon={cilUser} size="xl"></CIcon>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          Account
        </CDropdownHeader>
        <CDropdownItem href="/login">
          <CIcon icon={cilLoopCircular} className="me-2" />
          Switch course
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="/logout">
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
