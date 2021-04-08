import ReadingsState from "./context/ReadingsState";
import Header from "./components/Header";
import MtrForm from "./components/MtrForm";
import MtrReadingSummary from "./components/MtrReadingSummary";
import BodyContainer from "./components/BodyContainer";
function App() {
  return (
    <ReadingsState>
      <Header />
      <BodyContainer>
        <MtrForm />
        <MtrReadingSummary />
      </BodyContainer>
    </ReadingsState>
  );
}

export default App;
