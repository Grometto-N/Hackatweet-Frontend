import Hashtags from '../../components/Hashtags';
import { useRouter } from 'next/router';

function HashtagsPage() {
  const router = useRouter();
  const { hashtags } = router.query;
  console.log(hashtags)

  return <Hashtags />;
}

export default HashtagsPage;