import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar } from '../redux/uiSlice';
import { House, User, GearSix , ClockCounterClockwise  ,  Users ,   FloppyDisk  ,  UserList  } from 'phosphor-react';

const Sidebar = () => {
  const { sidebarExpanded } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  return (
    <aside className="h-screen  border-r shadow-sm">
      <nav className="h-full flex flex-col">
        {/* Logo Section */}
        <div className="p-4 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            alt="Logo"
            className={`overflow-hidden transition-all ${sidebarExpanded ? 'w-32' : 'w-0'}`}
          />
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {sidebarExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        {/* Navigation Links */}
        <ul className="flex-1 px-3">
          <SidebarItem icon={<House size={24} />} text="Dashboard" />
          <SidebarItem icon={<User size={24} />} text="Profile" />
          <SidebarItem icon={<GearSix size={24} />} text="Settings" />
          <SidebarItem icon={<FloppyDisk  size={24} />} text="Saved Videos" />
          <SidebarItem icon={<UserList size={24} />} text="Following" />
          <SidebarItem icon={<Users size={24} />} text="Followers" />
          <SidebarItem icon={<ClockCounterClockwise size={24} />} text="Watched Videos" />
        
        </ul>

        {/* User Info */}
        <div className="border-t flex items-center p-3">
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
            alt="User"
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`ml-3 overflow-hidden transition-all ${sidebarExpanded ? 'w-45' : 'w-0'}`}
          >
            <h4 className="font-semibold">John Doe</h4>
            <span className="text-sm text-gray-600">johndoe@gmail.com</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

const SidebarItem = ({ icon, text }) => {
  const { sidebarExpanded } = useSelector((state) => state.ui);

  return (
    <li className="flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer hover:bg-gray-100">
      {icon}
      <span className={`ml-3 overflow-hidden transition-all ${sidebarExpanded ? 'w-45' : 'w-0'}`}>
        {text}
      </span>
    </li>
  );
};

export default Sidebar;
