import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Header from "../src/components/Header"
import VerifyPage from "./pages/VerifyPage"
function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/sign-up" element ={<SignUp/>}/>
        <Route path="/login" element ={<SignIn/>}/>
        <Route path="/verify-me" element ={<VerifyPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
