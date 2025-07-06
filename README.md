# Optimizations to UX

- Need fallbacks for backdrop and poster images in the ShowDetails page.
- Change episodes watched field to "current episode" and seasons watched to "current season". Ensure that the user does not put in an episode higher than the total number of episodes for that season. Ensure users don't exceed the number of seasons.
- Display a progress indicator for the show that indicates how far through the show a user is (current_episode/total episodes in show). If complete, do not display the fields current_episode and current_season.
