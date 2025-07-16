import { Route, Routes } from "react-router-dom";
import navItems from "./data/navItems";
import NotFound_Page from "./pages/notFound.page";
import AppSideBar from "./components/sidebar.component";
import { SidebarTrigger } from "./components/ui/sidebar";
import StudentID from "@/pages/student/studentID.page";

function App() {
  return (
    <div className="flex w-full">
      <AppSideBar />
      <div className="w-full m-2">
        <SidebarTrigger className="sticky z-50 top-2 left-2 bg-black duration-500 transition-all text-white shadow-md" />
        <Routes>
          <Route path="/" element={<h1>Hello, World!</h1>} />
          {navItems.map((item) => {
            return (
              item.to && (
                <Route
                  key={item.id}
                  path={item.to}
                  element={<item.component />}
                />
              )
            );
          })}
          {navItems.map((item) => {
            return (
              item.children &&
              item.children.map((child) => {
                return (
                  <Route
                    key={child.id}
                    path={child.to}
                    element={<child.component />}
                  />
                );
              })
            );
          })}
          <Route path="/dashboard/students/:id" element={<StudentID />} />

          <Route path="*" element={<NotFound_Page />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
