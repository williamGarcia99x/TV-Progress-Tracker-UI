# Optimizations to UX

- Need fallbacks for backdrop and poster images in the ShowDetails page.
- Change episodes watched field to "current episode" and seasons watched to "current season". Ensure that the user does not put in an episode higher than the total number of episodes for that season. Ensure users don't exceed the number of seasons.
- Display a progress indicator for the show that indicates how far through the show a user is (current_episode/total episodes in show). If complete, do not display the fields current_episode and current_season.

## Bug

- There is a possibility that the token is still stored in cookies even though its time expired. This means that the act of
  just having the token doesn't mean that a user's session is valid. - This caused an issue when accessing ShowDetails. Even though the token was present, it was invalid so when we tried to extract potential tracking information for a show, my backend returned an error and next.js showed the 404 NOT FOUND page.
