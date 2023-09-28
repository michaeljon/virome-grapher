BEGIN {
    FS = "\t"
    OFS = ""

    batches["NOT-REGISTERED"] = 1
}

$1 != "sequenceid" {
    batches[$3]++;
}

END {
    comma = ""

    printf "[\n"

    for (b in batches) {
        printf "%s\"%s\"\n", comma, b
        comma = ","
    }

    printf "]\n"
}