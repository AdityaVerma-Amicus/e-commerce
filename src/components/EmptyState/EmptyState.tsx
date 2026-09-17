import { SearchX } from "lucide-react";
import "./EmptyState.css";

function EmptyState() {
    return (
        <div className="empty-state">
            <div className="empty-state-illustration" aria-hidden="true">
                <SearchX size={48} strokeWidth={1.5} />
            </div>

            <h3>No products found</h3>

            <p>
                Try changing your search or category filter.
            </p>
        </div>
    );
}

export default EmptyState;