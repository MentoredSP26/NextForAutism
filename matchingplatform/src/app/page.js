import Dropdown from "../components/creatematch/details";

export default function Home() {
  return (
    <div>
  <div className="top-container">
    <Dropdown 
      label="All Universities"
      instruction="Filter by University"
      options={["UC Berkeley", "Trees"]}
    />
  </div>
  <div className="dropdown-container">
    <Dropdown 
      label="Choose aspiring professional"
      instruction="Aspiring Professional"
      options={["John William", "Pork Pig", "Ada Lovelace"]}
    />
    <Dropdown 
      label="Choose established professional"
      instruction="Established Professional"
      options={["Jane Doe", "Bob Smith"]}
    />
  </div>
</div>
  );
}