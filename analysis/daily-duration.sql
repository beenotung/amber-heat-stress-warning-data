select
  date
, sum(end_time - start_time) as duration
from notice
group by date
