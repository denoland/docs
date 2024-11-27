import { SubNavigationItem } from "./SubNavigationItem.tsx";

export function SubNavigation(props: { active: string }) {
  return (
    <nav className="w-full px-8 pt-2 mt-16 max-w-screen-xl mx-auto mb-4 flex items-center">
      <SubNavigationItem page="learn" active={props.active} />
      <SubNavigationItem page="tutorials" active={props.active} />
      <SubNavigationItem page="examples" active={props.active} />
    </nav>
  );
}
