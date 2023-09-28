BEGIN {
    FS = "\t"
    OFS = "\t"

    # print "sequenceid", "processor", "batch", "sample", "shortname", "sortkey", "year", "month", "week", "state", "status", "source-lab", "rejected"
}

/STG-/ {
    gsub(".name.txt", "");
    split($1, p, "/");

    sequenceid = p[2];
    processor = "unknown";
    batch = "Softcell 2023-09-27";
    shortname = sample = p[4];
    sortkey = toupper(sample);
    year = month = week = state = status = rejected = ""
    sourcelab = "Softcell"

    print sequenceid, processor, batch, sample, shortname, sortkey, year, month, week, state, status, sourcelab, rejected
}