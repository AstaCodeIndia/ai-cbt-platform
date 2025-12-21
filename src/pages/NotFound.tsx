import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/auth/login"><Button className="gap-2"><Home className="w-4 h-4" />Go Home</Button></Link>
      </div>
    </div>
  );
};

export default NotFound;
