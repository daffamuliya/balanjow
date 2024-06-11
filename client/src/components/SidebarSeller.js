import SidebarItem from './SidebarItem';
import items from '../data/sidebarseller.json';

export default function Sidebar() {
  return (
    <div className="sidebar">
      {items.map((item, index) => (
        <SidebarItem key={index} item={item} />
      ))}
    </div>
  );
}
