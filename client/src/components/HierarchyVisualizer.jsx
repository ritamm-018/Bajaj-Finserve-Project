import './HierarchyVisualizer.css';

function HierarchyVisualizer({ data }) {
  const renderTree = (tree, indent = 0) => {
    return Object.entries(tree).map(([node, children]) => (
      <div key={node} style={{ marginLeft: `${indent * 24}px` }}>
        <div className="tree-node">
          <span className="node-label">{node}</span>
          {Object.keys(children).length > 0 && (
            <span className="node-arrow">→</span>
          )}
        </div>
        {renderTree(children, indent + 1)}
      </div>
    ));
  };

  return (
    <div className="visualizer">
      <div className="user-info">
        <h2>User Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{data.user_id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{data.email_id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Roll Number:</span>
            <span className="info-value">{data.college_roll_number}</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h2>Summary</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-value">{data.summary.total_trees}</div>
            <div className="summary-label">Valid Trees</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{data.summary.total_cycles}</div>
            <div className="summary-label">Cycles Detected</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">
              {data.summary.largest_tree_root || 'N/A'}
            </div>
            <div className="summary-label">Largest Tree Root</div>
          </div>
        </div>
      </div>

      {data.hierarchies.length > 0 && (
        <div className="hierarchies-section">
          <h2>Hierarchies</h2>
          <div className="hierarchy-grid">
            {data.hierarchies.map((hierarchy, idx) => (
              <div
                key={idx}
                className={`hierarchy-card ${
                  hierarchy.has_cycle ? 'cycle' : 'tree'
                }`}
              >
                <div className="hierarchy-header">
                  <h3>
                    {hierarchy.has_cycle ? '🔄' : '🌲'} Root: {hierarchy.root}
                  </h3>
                  {hierarchy.depth && (
                    <span className="depth-badge">Depth: {hierarchy.depth}</span>
                  )}
                  {hierarchy.has_cycle && (
                    <span className="cycle-badge">Cycle</span>
                  )}
                </div>
                <div className="tree-visualization">
                  {hierarchy.has_cycle ? (
                    <div className="cycle-message">
                      ⚠️ Cyclic dependency detected — no tree structure
                    </div>
                  ) : (
                    renderTree(hierarchy.tree)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.invalid_entries.length > 0 && (
        <div className="issues-section">
          <h3>❌ Invalid Entries</h3>
          <div className="issue-list">
            {data.invalid_entries.map((entry, idx) => (
              <span key={idx} className="issue-badge invalid">
                {entry || '(empty)'}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.duplicate_edges.length > 0 && (
        <div className="issues-section">
          <h3>⚠️ Duplicate Edges</h3>
          <div className="issue-list">
            {data.duplicate_edges.map((edge, idx) => (
              <span key={idx} className="issue-badge duplicate">
                {edge}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HierarchyVisualizer;
