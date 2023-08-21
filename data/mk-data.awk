BEGIN {
    FS = "\t"
    OFS = ""

    gsub("__all.tsv", "", FNAME)
    gsub("_", "-", FNAME)
    split(FNAME, a, "-")
    sample = a[1] a[2] a[3] a[4] a[5]

    if (match(FNAME, "sars-cov-2") > 0) {
        organism = a[6] "-" a[7] "-" a[8]
    } else {
        organism = a[6] "-" a[7]
    }

    printf "const sample_" sample "_" organism " = [\n";
}

!($1 ~ /sample/) {
    printf "  [" "'" $3 "', " $5  "],\n"
}

END {
    printf "  []\n"
    printf "]\n";
}