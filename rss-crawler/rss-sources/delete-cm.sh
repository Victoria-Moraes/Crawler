#ibmcloud target -r br-sao -g Crawlers
#ibmcloud ce project select -n crawlers

for file in *.cm; do

    
    CONFIGMAP=$(awk '{print substr($0,0,length($0)-3)}' <<< $file)
    echo "Deleting Config: $file and creating CONFIGMAP: $CONFIGMAP"

    ibmcloud ce cm delete --name $CONFIGMAP

done;