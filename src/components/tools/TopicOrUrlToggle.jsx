import Input from '../common/Input'
import AnimatedButton from '../common/AnimatedButton'

// Enforces the backend's "exactly one of topic/url" rule at the UI level —
// only one field is ever shown/editable at a time, so the unused one is
// always blank by construction. Shared by Meta Tag Generator and Schema
// Markup, the two tools with this exact request shape.
export default function TopicOrUrlToggle({ mode, onModeChange, topic, onTopicChange, url, onUrlChange }) {
  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-full border border-border bg-surface-2/60 p-1">
        {[
          { value: 'topic', label: 'By topic' },
          { value: 'url', label: 'By URL' },
        ].map((opt) => (
          <AnimatedButton
            key={opt.value}
            onClick={() => onModeChange(opt.value)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              mode === opt.value ? 'bg-primary text-on-primary shadow-sm' : 'text-text-muted hover:text-text'
            }`}
          >
            {opt.label}
          </AnimatedButton>
        ))}
      </div>

      {mode === 'topic' ? (
        <Input
          label="Topic"
          type="text"
          placeholder="e.g. best running shoes for beginners"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      ) : (
        <Input
          label="URL"
          type="text"
          placeholder="https://example.com/page"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
        />
      )}
    </div>
  )
}
