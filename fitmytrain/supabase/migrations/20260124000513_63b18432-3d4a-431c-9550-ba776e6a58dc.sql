-- Add UPDATE policy for weight_logs table
CREATE POLICY "Users can update own weight logs" 
ON public.weight_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add DELETE policy for weight_logs table
CREATE POLICY "Users can delete own weight logs" 
ON public.weight_logs 
FOR DELETE 
USING (auth.uid() = user_id);