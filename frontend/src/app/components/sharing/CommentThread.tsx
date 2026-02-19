import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  text: string;
  timestamp: string;
  isOwner?: boolean;
}

interface CommentThreadProps {
  dayNumber: number;
  timeSlot: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
  onAcceptSuggestion?: (commentId: string) => void;
  onDismissSuggestion?: (commentId: string) => void;
  canComment: boolean;
  isOwner: boolean;
}

export function CommentThread({
  dayNumber,
  timeSlot,
  comments,
  onAddComment,
  onAcceptSuggestion,
  onDismissSuggestion,
  canComment,
  isOwner,
}: CommentThreadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="relative">
      {/* Comment Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-200 rounded-lg transition-colors"
      >
        <MessageCircle className="size-5 text-gray-600" />
        {comments.length > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white size-5 flex items-center justify-center p-0 text-xs">
            {comments.length}
          </Badge>
        )}
      </button>

      {/* Comment Popover */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover */}
          <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-gray-200 animate-in zoom-in-95 fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h3 className="font-medium">Comments & Suggestions</h3>
                <p className="text-sm text-gray-600">
                  Day {dayNumber} • {timeSlot}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Comments List */}
            <div className="max-h-80 overflow-y-auto p-4 space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No comments yet. Be the first to suggest something!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="size-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {comment.author.avatar ? (
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          comment.author.initials
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">
                            {comment.author.name}
                          </p>
                          {comment.isOwner && (
                            <Badge variant="secondary" className="text-xs px-2 py-0">
                              Owner
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {comment.text}
                        </p>

                        {/* Owner Actions */}
                        {isOwner && !comment.isOwner && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-7"
                              onClick={() => onAcceptSuggestion?.(comment.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7"
                              onClick={() => onDismissSuggestion?.(comment.id)}
                            >
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            {canComment && (
              <div className="p-4 border-t border-gray-200">
                <Textarea
                  placeholder="Add a comment or suggestion..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="mb-2"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="sm"
                >
                  <Send className="size-4 mr-2" />
                  Send
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
