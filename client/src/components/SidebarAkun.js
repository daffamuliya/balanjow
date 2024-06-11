import SidebarItem from './SidebarItem';
import items from '../data/sidebarakun.json';

const SidebarAkun = () => {
  return (
    <div className="sidebar">
      {items.map((item, index) => (
        <SidebarItem key={index} item={item} />
      ))}
    </div>
  );
};

export default SidebarAkun;
