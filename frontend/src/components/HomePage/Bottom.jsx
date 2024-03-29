import {Bottomcss} from './Bottomcss'
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
export const Bottom = ()=>{
    return <Bottomcss>


<div className="div4">
<div className="fb">
    <div className="onee">
        <div><FacebookIcon/></div>
        <div>link<TwitterIcon/></div>
        <div><InstagramIcon/></div>
    </div>
    <div className="copy">
        <p>© 2024 BookMyTrip PVT. LTD.</p>
        <p>Country India</p>
    </div>
</div>
</div>
    </Bottomcss>
}