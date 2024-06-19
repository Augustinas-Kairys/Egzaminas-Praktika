import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import RegisterForm from '../auth/register';
import LoginForm from '../auth/login';
import AdminPanel from '../main/adminpanel';
import Dashboard from '../main/dashboard';
import PostCreate from '../post/postcreate';
import Posts from '../post/posts';
import Profile from '../main/profile';
import EditPost from '../post/editpost';
import AdminCategory from '../main/admincategory';

function MainRouter() {
  return (
    <Router>
      <Routes> 
        <Route path="/Register" element={<RegisterForm />} /> 
        <Route path="/Login" element={<LoginForm />} /> 
        <Route path="/Admin" element={<AdminPanel />} /> 
        <Route path="/Admin2" element={<AdminCategory />} /> 
        <Route path="/" element={<Dashboard />} />
        <Route path="/Postcreate" element={<PostCreate />} />
        <Route path="/Post" element={<Posts />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Edit-Post/:postId" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
