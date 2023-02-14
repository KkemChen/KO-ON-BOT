# #!/usr/bin/env bash
# python3.10 scheduler.py
# (cd MiguMusicApi && npm start & cd ../) &
# (cd QQMusicApi && npm start & cd ../) &
# (cd NeteaseCloudMusicApi && node app.js & cd ../) &
# python3.10 core.py 1

#!/usr/bin/env bash
echo "========================"
echo "-start    Strat the bot."
echo "-stop     Stop the bot."
echo "========================"
echo ""

function start(){
	screen -dmS KO-ON-scheduler python3 scheduler.py
	echo "Start KO-ON-scheduler."

	cd MiguMusicApi
	screen -dmS KO-ON-MiguMusicApi npm start
	cd ../
	echo "Start KO-ON-MiguMusicApi."

	cd QQMusicApi
	screen -dmS KO-ON-QQMusicApi npm start
	cd ../
	echo "Strat KO-ON-QQMusicApi."

	cd NeteaseCloudMusicApi
	screen -dmS KO-ON-NeteaseCloudMusicApi node app.js
	cd ../
	echo "Start KO-ON-NeteaseCloudMusicApi."

	screen -dmS KO-ON-core python3 core.py 1
	echo "Start KO-ON-core."

}
function stop(){
	screen -S KO-ON-scheduler -X quit
	echo "Stop KO-ON-scheduler."

	screen -S KO-ON-MiguMusicApi -X quit
	echo "Stop KO-ON-MiguMusicApi."

	screen -S KO-ON-QQMusicApi -X quit
	echo "Stop KO-ON-QQMusicApi."

	screen -S KO-ON-NeteaseCloudMusicApi -X quit
	echo "Stop KO-ON-NeteiaseCloudMusicApi."

	screen -S KO-ON-core -X quit
	echo "Stop KO-ON-core."
}

running=0
if (( $(screen -ls | grep -c -P '^\t\d+\.KO-ON-(core|NeteaseCloudMusicApi|QQMusicApi|MiguMusicApi|scheduler)\t') > 0 )); then
	# screen names KO-ON is running.
	running=1
fi

if [[ $1 == "-start" ]]; then
	if [ $running == 1 ]; then
		echo "KO-ON is running. Stop it then restarting."
		stop
		start
		echo "Done."
	else
		start
		echo "Done."
	fi
elif [[ $1 == "-stop" ]]; then
	if [ $running == 1 ]; then
		stop
		echo "Done."
	else
		echo "KO-ON didn't run."
	fi
else
	echo "Toggle KO-ON run/stop"
	if [ $running == 1 ]; then
		stop
	else
		start
	fi
fi