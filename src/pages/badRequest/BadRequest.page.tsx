import { Link } from 'react-router-dom';

function BadRequestPage() {
  return (
    <div>
      <h1>404</h1>
      <Link to="/">Повернутися на головну.</Link>
    </div>
  );
}

export default BadRequestPage;
