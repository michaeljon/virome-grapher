#
# builds the sequence metadata for the UI
#
# usage:
# cd server 
# /bin/ls -1 *.json | grep -vP "all-samples|batchlist" | awk -vALL_SAMPLES=~/tmp/demo2/source-data/all-samples-with-metadata.tsv -f ../scripts/mk-list.awk > all-samples.json
#

/.json/ { 
    gsub(".json", "");

    gsub("depths/", "");
    split($1, a, "_")
    sample = a[1]
    organism = a[2]

    s = samples[sample]
    if (s == "") {
        samples[sample] = organism
    } else {
        samples[sample] = samples[sample] "|" organism
    }

    metadata = ""
    cmd = "grep " sample " " ALL_SAMPLES " | cut -d '\t' -f 3,4,6"; cmd | getline metadata; close(cmd)
    split(metadata, a, "\t");

    if (metadata != "") {
        batches[sample] = a[1]
        internal_names[sample] = a[2]
        sortkeys[sample] = a[3]
    } else {
        batches[sample] = "NOT-REGISTERED"
        internal_names[sample] = sample
        sortkeys[sample] = toupper(sample)
    }
}

END {
    printf "[\n"
    for (s in samples) {
        printf "  { \"sequenceid\": \"" s "\", \"batch\": \"" batches[s] "\", \"sample\": \"" internal_names[s] "\", \"sortkey\": \"" sortkeys[s] "\", "
        printf "\"organisms\": [ "
        
        r = split(samples[s], o, "|");

        for (i = 1; i <= r - 1; i++) {
            printf "\"" o[i] "\", "
        }
        printf "\"" o[r] "\""
        
        printf " ] "
        printf " },\n"
    }

    printf "  { }\n"

    printf "]\n"
}