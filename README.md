# Optimizations to UX

- When users are navigated to the login screen after trying to track a show being unathenticated, on successful login, redirect them back to the show they were trying to track or to the protected route they were trying to access. DONE
- Optimization todo: If there's an error with the submission of the TrackingInfoForm, TrackingInfoForm
  should not re-render so the latest information inputted by the user should remain.
- Need fallbacks for backdrop and poster images in the ShowDetails page.
- When user switches status to Planning, reset all field Form field values to their default values. Also, display N
