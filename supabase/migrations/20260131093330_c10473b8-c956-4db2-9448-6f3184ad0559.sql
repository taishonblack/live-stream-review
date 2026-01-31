-- Add trigger to auto-create session notes when session is created
CREATE TRIGGER on_session_created
  AFTER INSERT ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_session();