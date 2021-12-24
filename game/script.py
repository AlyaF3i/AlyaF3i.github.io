import pytube as yt

video = yt.YouTube('https://www.youtube.com/watch?v=dhYOPzcsbGM').streams.get_by_itag(139).download()
[print(a) for a in video]