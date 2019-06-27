import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import SRLLightboxThubnailGallery from "./SRLLightboxThubnailGallery";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  SRLLightboxContent,
  SRRLLightboxCaption,
  SRLLightboxImageContainer,
  SRLLightboxImage
} from "../styles";

function SRLLightboxSlideComponent({
  source,
  caption,
  showthumbnails,
  showcaption,
  images,
  id,
  handleCloseLightbox,
  handleCurrentImage
}) {
  const SRLImageContainerRef = useRef();

  useOnClickOutside(SRLImageContainerRef, () => handleCloseLightbox());

  return (
    <SRLLightboxContent className="SRLContent">
      <SRLLightboxImageContainer
        showthumbnails
        showcaption
        className="SRLImageContainer"
      >
        <TransitionGroup>
          <CSSTransition key={id} classNames="image-transition" timeout={800}>
            <SRLLightboxImage
              ref={SRLImageContainerRef}
              className="SRLImage"
              src={source}
              alt={caption}
            />
          </CSSTransition>
        </TransitionGroup>
      </SRLLightboxImageContainer>

      {showcaption && (
        <SRRLLightboxCaption className="SRLCaption">
          <p className="SRLCaption">{caption}</p>
        </SRRLLightboxCaption>
      )}

      {showthumbnails && (
        <SRLLightboxThubnailGallery
          handleCurrentImage={handleCurrentImage}
          currentId={id}
          images={images || []}
        />
      )}
    </SRLLightboxContent>
  );
  // Hook

  function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = event => {
          // Do nothing if clicking ref's element or descendent elements
          if (
            !ref.current ||
            ref.current.contains(event.target) ||
            event.target.classList.contains("SRLNextButton") ||
            event.target.classList.contains("SRLPrevButton") ||
            event.target.classList.contains("SRLCloseButton") ||
            event.target.classList.contains("SRLshowthumbnails") ||
            event.target.classList.contains("SRLThumb") ||
            event.target.classList.contains("SRLCaption") ||
            event.button !== 0
          ) {
            return;
          }

          handler(event);
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      },
      // Add ref and handler to effect dependencies
      // It's worth noting that because passed in handler is a new ...
      // ... function on every render that will cause this effect ...
      // ... callback/cleanup to run every render. It's not a big deal ...
      // ... but to optimize you can wrap handler in useCallback before ...
      // ... passing it into this hook.
      [ref, handler]
    );
  }
}

SRLLightboxSlideComponent.propTypes = {
  source: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  caption: PropTypes.string,
  showthumbnails: PropTypes.bool,
  showcaption: PropTypes.bool,
  images: PropTypes.array,
  handleCloseLightbox: PropTypes.func,
  handleCurrentImage: PropTypes.func,
  id: PropTypes.string
};

export default SRLLightboxSlideComponent;