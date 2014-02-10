Log for technical changes (not language or image edits)
This is a reference for what I should change on the powerppt git repo

## 7 February 2014
- Removed keypress library dependency
- Removed manageControls() redundancies
- Preloading loader gif without manually putting it in the html
    - Removed .firstLoad from CSS
- Changed manageControls to toggle visibility not display (now it doesn't fade, but it maintains layout even when hidden)
- Changed controls' sizes
- Changed default slide font size (now 1.9rem --> 19px)