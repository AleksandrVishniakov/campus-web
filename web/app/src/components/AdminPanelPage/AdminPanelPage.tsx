import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import IssuesTab from './IssuesTab';
import UsersTab from './UsersTab';
import './AdminPanel.css';
import IssuesAPI from '../../api/issues/IssuesAPI';

interface Props {
    issuesAPI: IssuesAPI

    onError:(e: string)=>void
    onClose:()=>void
    onOpenIssue: (
        id: number,
        name?: string,
        surname?: string,
        room?: string,
        classN?: string
    ) => void
}

const AdminPanelPage: React.FC<Props> = (props) => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <div className="admin-panel-container">
      <h1>Панель управления</h1>
      
      <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
        <Tab label="Заявки" />
        <Tab label="Пользователи" />
      </Tabs>

      <Box mt={2}>
        {currentTab === 0 && <IssuesTab 
            issuesAPI={props.issuesAPI}
            onClose={props.onClose}
            onError={props.onError}
            onOpenIssue={props.onOpenIssue}
        />}
        {currentTab === 1 && <UsersTab />}
      </Box>
    </div>
  );
};

export default AdminPanelPage;