import PropTypes from "prop-types";
import cn from "../../Utils/cn/Cn";

const variantsMapping = {
  h1: " font-heading font-bold leading-[54px] md:leading-[72px] lg:leading-[90px] text-xl md:text-[30px] lg:text-[40px]",
  h2: " lg:text-[4rem] text-[2rem] text-black font-semibold pb-[10px] border-b border-[#666666] text-left",
  h3: " lg:text-[32px] text-2xl font-medium",
  h4: " font-heading font-bold leading-[27px] md:leading-[27px] lg:leading-[30px] text-lg  md:text-lg  lg:text-xl",
  h5: " font-heading font-bold leading-[21px] md:leading-[21px] lg:leading-[24px] text-sm  md:text-text-sm lg:text-base",
  h6: " font-heading font-bold leading-[18px] md:leading-[18px] lg:leading-[18px] text-xs  md:text-text-xs lg:text-xs",
  primary_body: "text-base md:text-sm text-base",
  small_body: "lg:text-sm text-sm font-normal",
  caption: "lg:text-xs md:text-xs text-xs ",
  p: "lg:text-base md:text-base text-sm leading-normal ",
  subtitle:
    "lg:text-xl text-base text-black font-normal leading-[150%] pt-[32px] pb-[51px] px-5 text-left",
  title: "lg:text-5xl text-3xl font-semibold",
  text: "lg:text-xl text-lg font-medium",
};

const Typography = ({ variant, color, className, children, ...props }) => {
  const classes = cn(
    variantsMapping[variant],
    color || "text-black",
    className || ""
  );

  const HTMLElement = ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "p"].includes(
    variant
  )
    ? variant
    : "div";

  return (
    <HTMLElement className={classes} {...props}>
      {children}
    </HTMLElement>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "h7",
    "body1",
    "body2",
    "caption",
    "p",
  ]),
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Typography;
