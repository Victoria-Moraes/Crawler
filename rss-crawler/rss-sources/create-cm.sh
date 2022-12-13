#ibmcloud target -r br-sao -g Crawlers
#ibmcloud ce project select -n crawlers

for file in *.cm; do

    
    CONFIGMAP=$(awk '{print substr($0,0,length($0)-3)}' <<< $file)
    echo "Executing Config: $file and creating CONFIGMAP: $CONFIGMAP"

    ibmcloud ce cm create --name $CONFIGMAP --from-env-file $file

done;